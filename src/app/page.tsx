/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import axios from 'axios';
import { Loader2 } from 'lucide-react';
import Head from 'next/head';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import { cn } from '@/lib/utils';

import Button from '@/components/buttons/Button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

/**
 * SVGR Support
 * Caveat: No React Props Type.
 *
 * You can override the next-env if the type is important to you
 * @see https://stackoverflow.com/questions/68103844/how-to-override-next-js-svg-module-declaration
 */

export default function HomePage() {
  const searchParams = useSearchParams();
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [_, setAiAnswer] = useState({
    ProductLine: '',
    Category: '',
    Subcategory: '',
  });
  const [selectedAnswer, setSelectedAnswer] = useState({
    ProductLine: '',
    Category: '',
    Subcategory: '',
  });
  const [dropdownOptions, setDropdownOptions] = useState({
    ProductLines: [],
    Categories: [],
    Subcategories: [],
  });

  const handleProductLineChange = (value: string) => {
    setSelectedAnswer((prevState) => ({
      ...prevState,
      ProductLine: value,
    }));
  };
  const handleCategoryChange = (value: string) => {
    setSelectedAnswer((prevState) => ({
      ...prevState,
      Category: value,
    }));
  };
  const handleSubcategoryChange = (value: string) => {
    setSelectedAnswer((prevState) => ({
      ...prevState,
      Subcategory: value,
    }));
  };

  const fetchDropdownOptions = async () => {
    const response = await axios.get('/api/get-dropdown-values');
    const data = response.data;
    setDropdownOptions(data);
  };

  const handleFormSubmit = async () => {
    if (
      selectedAnswer.ProductLine === '' ||
      selectedAnswer.Category === '' ||
      selectedAnswer.Subcategory === ''
    ) {
      alert('Please select all the options');
      return;
    }

    setFormSubmitting(true);

    try {
      await axios.post('/api/add-feedback', {
        prompt,
        answer: {
          ProductLine: selectedAnswer.ProductLine,
          Category: selectedAnswer.Category,
          Subcategory: selectedAnswer.Subcategory,
        },
      });

      setFormSubmitted(true);
      setFormSubmitting(false);
    } catch (error) {
      alert('An Error occured!');
      return;
    }
  };

  useEffect(() => {
    const prompt = searchParams.get('que');
    const answer = searchParams.get('ans');

    if (prompt && answer) {
      setPrompt(prompt);

      const [ProductLine, Category, Subcategory] = answer.split('-');
      setAiAnswer(() => ({
        ProductLine,
        Category,
        Subcategory,
      }));
    }

    fetchDropdownOptions();
  }, []);
  return (
    <main>
      <Head>
        <title>Taxonomy Bot Feedback</title>
      </Head>
      <section className='bg-white'>
        <div className='layout relative flex flex-col items-center justify-center py-12'>
          <Card className={cn([formSubmitted && 'hidden'])}>
            <CardHeader>
              <CardTitle className='text-2xl'>
                Fine-tune taxonomy bot!
              </CardTitle>
              <CardDescription>
                Contribute to the improvement of Taxonomy bot's performance{' '}
                <br /> by assessing its answers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form>
                <div className='grid w-full items-center gap-4'>
                  <div className='flex flex-col space-y-1.5'>
                    <Label htmlFor='name'>Prompt given to the bot!</Label>
                    <Textarea
                      id='name'
                      placeholder='Prompt given to the bot'
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      rows={4}
                    />
                  </div>

                  <p className='mt-6'>
                    Select the correct taxonomy for above prompt! 👇🏻
                  </p>
                  <div className='flex flex-col space-y-1.5'>
                    <Label htmlFor='productLine'>
                      Product Line / Department
                    </Label>
                    <Select onValueChange={handleProductLineChange}>
                      <SelectTrigger id='productLine'>
                        <SelectValue placeholder='Select' />
                      </SelectTrigger>
                      <SelectContent position='popper'>
                        {dropdownOptions.ProductLines.map(
                          (productLine, index) => (
                            <SelectItem key={index} value={productLine}>
                              {productLine}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className='flex flex-col space-y-1.5'>
                    <Label htmlFor='category'>Category</Label>
                    <Select onValueChange={handleCategoryChange}>
                      <SelectTrigger id='category'>
                        <SelectValue placeholder='Select' />
                      </SelectTrigger>
                      <SelectContent position='popper'>
                        {dropdownOptions.Categories.map((category, index) => (
                          <SelectItem key={index} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className='flex flex-col space-y-1.5'>
                    <Label htmlFor='subcategory'>Subcategory</Label>
                    <Select onValueChange={handleSubcategoryChange}>
                      <SelectTrigger id='subcategory'>
                        <SelectValue placeholder='Select' />
                      </SelectTrigger>
                      <SelectContent position='popper'>
                        {dropdownOptions.Subcategories.map(
                          (subcategory, index) => (
                            <SelectItem key={index} value={subcategory}>
                              {subcategory}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </form>
            </CardContent>

            <CardFooter className='flex justify-between flex-col mt-4'>
              <Button
                variant='dark'
                fullWidth
                className='rounded-lg'
                onClick={handleFormSubmit}
                disabled={formSubmitting}
              >
                {formSubmitting && (
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                )}
                Submit
              </Button>
            </CardFooter>
          </Card>

          <Card
            className={cn([!formSubmitted && 'hidden'], 'max-w-lg text-center')}
          >
            <CardHeader>
              <CardTitle className='text-2xl'>
                ThankYou for the feedback!
              </CardTitle>
            </CardHeader>
            <CardContent>
              The Taxonomy AI bot will now undergo a quick tune-up to
              incorporate new learnings, You should be able see the reflected
              learnings in the bot soon!
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}
